#前端自动化工具（功能）@代表，已经实现的功能
#	@部署环境，合并文件。
#	未来增加：部署环境，压缩。	

import string
import sys
import libs.config

x = libs.config.file_config
def gruntFile(x):
	y = {}
	_newFile = {};
	for _key,_value in x.items():
		_newFile[_key] = open('new/'+_key+'.js','w',encoding = 'utf-8')
		y[_key] = []
		for _file in _value:
			print('合并的文件：'+_file)
			_open = open(_file,'r',encoding='utf-8');
			_content = _open.read()
			y[_key].append(_content) 
			_open.close()
			pass
		pass
	for _k,_v in y.items():
		_f = _newFile[_k]
		for _Content in _v:
			_f.write(_Content)
			pass
		print(_k +'.js------文件合并完成完成')
		_f.close()
		pass
	pass
gruntFile(x)
